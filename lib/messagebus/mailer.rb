module Messagebus
  class Mailer
    def initialize(api_key)
     @client = MessagebusApi::Messagebus.new(api_key)
   end

    attr_accessor :settings

    def new(*settings)
        self
    end

   def from_header_parse(string)
     string.split('<')[0].delete('"')
   end

   def deliver!(message)
    msg = {:toEmail => message.to.first, :subject => message.subject, :fromEmail =>message.from.first, :fromName => from_header_parse(message[:from].to_s)}

    if message.multipart?
      msg[:plaintextBody] = message.text_part.body.to_s if message.text_part
      msg[:htmlBody] = message.html_part.body.to_s if message.html_part
    end

    begin
      @client.add_message(msg, true)
    rescue => message_bus_api_error
      raise "Messagebus API error=#{message_bus_api_error}, message=#{msg.inspect}"
    end
  end 
end
end
