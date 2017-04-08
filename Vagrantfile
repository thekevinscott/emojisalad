Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"
  config.ssh.forward_agent = true

  config.vm.network :forwarded_port, guest: 80, host: 8931, auto_correct: true

  config.vm.synced_folder ".", "/var/www", type: "rsync",
        rsync__exclude: ".git/"

  config.vm.provider "virtualbox" do |v|
    v.name = "Emoji Salad"
    v.customize ["modifyvm", :id, "--memory", "1024"]
  end

  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get -y update
    sudo apt-get install -y nodejs
    SHELL

end
